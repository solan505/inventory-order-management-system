def create_product(client, name="Desk Lamp", sku="SKU-1", quantity=10, price="25.50"):
    response = client.post(
        "/products",
        json={
            "name": name,
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


def test_product_crud_endpoints(client):
    product = create_product(client)

    list_response = client.get("/products")
    assert list_response.status_code == 200
    assert list_response.json()[0]["sku"] == "SKU-1"

    get_response = client.get(f"/products/{product['id']}")
    assert get_response.status_code == 200
    assert get_response.json()["name"] == "Desk Lamp"

    update_response = client.put(
        f"/products/{product['id']}",
        json={
            "name": "Desk Lamp Pro",
            "sku": "SKU-1-PRO",
            "price": "35.75",
            "quantity_in_stock": 12,
        },
    )
    assert update_response.status_code == 200
    assert update_response.json()["sku"] == "SKU-1-PRO"
    assert update_response.json()["quantity_in_stock"] == 12

    delete_response = client.delete(f"/products/{product['id']}")
    assert delete_response.status_code == 204

    missing_response = client.get(f"/products/{product['id']}")
    assert missing_response.status_code == 404


def test_product_validation_rejects_negative_quantity(client):
    response = client.post(
        "/products",
        json={
            "name": "Invalid Product",
            "sku": "INVALID-1",
            "price": "10.00",
            "quantity_in_stock": -1,
        },
    )

    assert response.status_code == 422


def test_customer_crud_endpoints(client):
    customer = create_customer(client)

    list_response = client.get("/customers")
    assert list_response.status_code == 200
    assert list_response.json()[0]["email"] == "buyer@example.com"

    get_response = client.get(f"/customers/{customer['id']}")
    assert get_response.status_code == 200
    assert get_response.json()["full_name"] == "Test Buyer"

    delete_response = client.delete(f"/customers/{customer['id']}")
    assert delete_response.status_code == 204

    missing_response = client.get(f"/customers/{customer['id']}")
    assert missing_response.status_code == 404


def test_order_endpoints_stock_restore_and_dashboard(client):
    primary = create_product(client, sku="ORDER-1", quantity=10, price="10.00")
    low_stock = create_product(
        client, name="Low Stock Item", sku="LOW-1", quantity=2, price="5.50"
    )
    customer = create_customer(client)

    create_response = client.post(
        "/orders",
        json={
            "customer_id": customer["id"],
            "items": [
                {"product_id": primary["id"], "quantity": 2},
                {"product_id": low_stock["id"], "quantity": 1},
            ],
        },
    )
    assert create_response.status_code == 201
    order = create_response.json()
    assert order["total_amount"] == 25.5
    assert len(order["items"]) == 2

    list_response = client.get("/orders")
    assert list_response.status_code == 200
    assert list_response.json()[0]["id"] == order["id"]

    detail_response = client.get(f"/orders/{order['id']}")
    assert detail_response.status_code == 200
    assert detail_response.json()["customer"]["email"] == customer["email"]

    dashboard_response = client.get("/dashboard")
    assert dashboard_response.status_code == 200
    dashboard = dashboard_response.json()
    assert dashboard["total_products"] == 2
    assert dashboard["total_customers"] == 1
    assert dashboard["total_orders"] == 1
    assert dashboard["low_stock_count"] == 1
    assert dashboard["low_stock_products"][0]["sku"] == "LOW-1"

    delete_response = client.delete(f"/orders/{order['id']}")
    assert delete_response.status_code == 204

    restored_product = client.get(f"/products/{primary['id']}").json()
    assert restored_product["quantity_in_stock"] == 10

    missing_response = client.get(f"/orders/{order['id']}")
    assert missing_response.status_code == 404
