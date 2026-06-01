def create_product(client, sku="SKU-1", quantity=10, price="25.50"):
    response = client.post(
        "/products",
        json={
            "name": "Desk Lamp",
            "sku": sku,
            "price": price,
            "quantity_in_stock": quantity,
        },
    )
    assert response.status_code == 201
    return response.json()


def create_customer(client, email="buyer@example.com"):
    response = client.post(
        "/customers",
        json={
            "full_name": "Test Buyer",
            "email": email,
            "phone_number": "+1-555-0101",
        },
    )
    assert response.status_code == 201
    return response.json()


def test_product_sku_must_be_unique(client):
    create_product(client, sku="unique-1")
    response = client.post(
        "/products",
        json={
            "name": "Second Product",
            "sku": "UNIQUE-1",
            "price": "10.00",
            "quantity_in_stock": 5,
        },
    )

    assert response.status_code == 409
    assert response.json()["detail"] == "Product SKU already exists"


def test_customer_email_must_be_unique(client):
    create_customer(client, email="same@example.com")
    response = client.post(
        "/customers",
        json={
            "full_name": "Another Buyer",
            "email": "same@example.com",
            "phone_number": "+1-555-0102",
        },
    )

    assert response.status_code == 409
    assert response.json()["detail"] == "Customer email already exists"


def test_order_reduces_stock_and_calculates_total(client):
    product = create_product(client, quantity=10, price="12.25")
    customer = create_customer(client)

    response = client.post(
        "/orders",
        json={
            "customer_id": customer["id"],
            "items": [{"product_id": product["id"], "quantity": 3}],
        },
    )

    assert response.status_code == 201
    order = response.json()
    assert order["total_amount"] == 36.75
    assert order["items"][0]["line_total"] == 36.75

    product_response = client.get(f"/products/{product['id']}")
    assert product_response.json()["quantity_in_stock"] == 7


def test_order_fails_when_stock_is_insufficient(client):
    product = create_product(client, quantity=2)
    customer = create_customer(client)

    response = client.post(
        "/orders",
        json={
            "customer_id": customer["id"],
            "items": [{"product_id": product["id"], "quantity": 3}],
        },
    )

    assert response.status_code == 409
    assert "Insufficient stock" in response.json()["detail"]

    product_response = client.get(f"/products/{product['id']}")
    assert product_response.json()["quantity_in_stock"] == 2
