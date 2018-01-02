---
description: Submit a product to be listed on Docker Store
keywords: Docker, docker, store, purchase images
title: Bring Your Own License (BYOL) products on Store
---

## What is Bring Your Own License (BYOL)?

Bring Your Own License (BYOL) allows customers with existing software licenses
to easily migrate to the containerized version of the software you make
available on Docker Store.

There are two types of BYOL plans available to Independent Software Vendors
(ISVs):
- **Ungated** customer access to content: customers can see and access an
  ISV's BYOL product listing by subscribing to the product with their Docker ID.

- **Gated** customer access to content: customers can see an ISV's BYOL product
  listing, but cannot access the content until the ISV creates an order for the
  product with Docker Store APIs. A product key is generated by Docker Store and
  given back to the ISV. The ISV then sends this product key to the customer
  they wish to entitle. After fulfilling the order to a specific Docker ID, the
  customer can access the previously gated BYOL content.

ISVs can use the Docker Store/Hub as an entitlement and distribution platform.
Using API’s provided by Docker, ISVs can entitle users and distribute their
Dockerized content to many different audiences:
- Existing customers that want their licensed software made available as Docker containers.
- New customers that are only interested in consuming their software as Docker containers.
- Trial or beta customers, where the ISV can distribute feature or time limited software.

Docker provides a fulfillment service so that ISVs can programmatically entitle
users, by creating subscriptions to their content in Docker Store.

## Ungated BYOL

### Prerequisites and setup

To use Docker as your fulfillment service, an ISV must:
- [Apply and be approved as a Docker Store Publisher](https://store.docker.com/publisher/signup)
- Apply and be approved to list an Ungated BYOL product
- Create one or more Ungated BYOL product plans, in the Docker Store Publisher center.

## Creating an ungated BYOL plan

In Plans & Pricing section of the Publisher Center, ensure the following:
- Price/Month should be set to $0
- There should be no free trial associated with the product
- Under the Pull Requirements dropdown, "Subscribed users only" should be selected.

## Gated BYOL

### Prerequisites and setup

To use Docker Store as your fulfillment service, an ISV must:
- Apply and be approved as a Docker Store Publisher.
- Apply and be approved to use the Gated BYOL feature.
- Create a BYOL, "bring your own license" plans, in the Docker Store Publisher center.

Docker will provide:
- One or more authorization tokens to the publisher for making API requests to the Docker fulfillment service.
- A partner identifier.

### Fulfillment and orders usage

Docker Store provides an API for ISVs to create product orders and generate access tokens (in the form or URLs) for customer subscriptions to their products. ISVs will also be able to access reports and usage information about their products on Docker Store.

The BYOL program at Docker Store helps ISVs control access to their products for multiple use cases, such as:
- New customers purchasing software from the ISV for the first time
- Existing customers who need access to the Dockerized form of the ISV's content
- Prospects who need access to a subset of the ISV's Dockerized content for a limited time.

These steps explain how an ISV grants entitlements to their Docker Store products:
1. The ISV creates a gated BYOL plan detailing user entitlements to their Docker Store products.
2. The ISV issues a "Create Order" API request to the Docker fulfillment service. The request includes the specific BYOL plan, any required quantities, and (optionally) any product keys that the ISV's software requires.
3. The Docker fulfillment service returns: (1) an order ID for the ISV's internal records, and (2) an access token (in URL form) that can be given to users.
4. The ISV distributes the access token/URL to users in whatever form works with their sales flow--at the end of a UI purchase flow, in a follow up email, etc.
5. The user navigates to the access token/URL and is prompted to sign in with a Docker ID (or create an account) on the procurement page of Docker Store.
6. The user is shown information on the order (a description of the product and quantities) and any terms and conditions specified by the ISV.
7. If the user agrees to the ISV's terms and accepts the order, a subscription is created to the appropriate plan for the duration specified in the order. The user can now access the Docker image as any other subscription on Docker store.
8. The user obtains the image at a terminal by running `docker login`, entering their subscription credentials, and following the accompanying setup instructions.
9. If needed by the ISV's software, the user can obtain the product key for their subscription from Docker Store, and enter it into the ISV's container, following instructions provided by the ISV.

A publisher can change or cancel an order before it is fulfilled with the
"Update Order" API request documented below. After the order has been fulfilled,
the ISV can change or cancel the corresponding subscription by making requests
to the Store billing service.

The subscription that a user receives at the end of this process appears with
their other subscriptions in Docker Store. However, the user will not be able to
directly change or cancel it, as it represents an entitlement under the control
of the ISV. The Store UI will direct the user to contact the ISV for any desired
changes.

### Product keys

If an ISV's software uses product keys, these may be supplied at the time of order creation. Once the order has been fulfilled, the product keys will be available to the user from the user's subscription detail page. The ISV's installation documentation should refer the user to look for the keys there.

### API usage

An approved ISV only needs to make a single API request to create an order and
obtain an access token for a user, the "Create Order" request documented below.
Other API requests are needed only if the ISV needs to alter/cancel the order,
or look up information about the order after it has been created. 

### Gated BYOL plan setup

Once a publisher has been onboarded to create an gated BYOL plan, the publisher
center will begin to allow them to set up a new, unpublished plan with the gated
BYOL option:

![byol plan](images/publish_byol.png)

In this stage of the publisher flow, note the **Pull Requirements** selection as
"Bring your own License", as well as the **Tier Description** which should
include an external reference to where a customer must go to acquire their
license from the publisher.

## API reference for ISVs

### Endpoint, authorization, content

All API requests should be made to: <https://store.docker.com/api/fulfillment/v1/...>

For example, the full path for the "Create Order" API will POST to: https://store.docker.com/api/fulfillment/v1/orders

All API requests to the fulfillment service must have an "Authorization: Bearer"
header with an authorization string that will be provided by Docker. An example
header is:

```
Authorization: Bearer 9043ea5c-172a-4d4b-b255-a1dab96fb631
```

ISVs should closely protect their authorization token as if it were a password,
and alert Docker if it has been compromised or needs replacement.

All request and response bodies must/will be encoded with JSON using UTF-8.

### Data structures

### OrderCreateRequest (object)

#### Properties

* partner\_id (PartnerID, required) - Business entity creating this order.
* customer (Customer, optional) - Order customer information.
* items (array[OrderItemCreateRequest], required) - One or more items associated with the order.
* token (string, optional) - If supplied, the customer access token for this order.
* metadata (OrderMetadata, optional) - Key/value strings to be stored with order.

### Order (object)

#### Properties

* order\_id: `ord-93b2dba2-79e3-11e6-8b77-86f30ca893d3` (string, required) - The order id.
* token: `DOCKER-TOKEN-234` (string, required) - The access token created for this order by the fulfillment service.
* docker\_id: `a76808b87b6c11e68b7786f30ca893d3` (string, optional) - The docker id of the user that fulfilled the order. Note that this is not set unless the order is in a fulfilled state.
* state: created (enum, required) - The order state.
  * created
  * fulfilled
  * cancelled
* partner\_id (PartnerID, required) - Business entity that created this order.
* customer (Customer, optional) - Order customer information.
* items (array[OrderItem], required) - One or more items associated with the order.
* metadata (OrderMetadata, optional) - Any key/value strings given in the order creation request.
* created: `2016-06-02T05:10:54Z` (string, required) - An ISO-8601 order creation timestamp.
* updated: `2016-06-02T05:10:54Z` (string, required) - An ISO-8601 order updated timestamp.

### OrderItem (object)

#### Properties

* id: `390745e6-faba-11e6-bc64-92361f002671` (string, required) - The order item id.
* product\_id: `bf8f7c15-0c3b-4dc5-b5b3-1595ba9b589e` (string, required) - The Store product id associated with the order item.
* rate\_plan\_id: `85717ec8-6fcf-4fd9-9dbf-051af0ce1eb3` (string, required) - The Store rate plan id associated with the order item.
* subscription\_start\_date: `2016-06-02T05:10:54Z` (string, optional) - An ISO-8601 timestamp representing the subscription start date. If not specified, the subscription will start at order fulfillment time.
* subscription\_end\_date: `2019-06-02T05:10:54Z` (string, optional) - An ISO-8601 timestamp representing the subscription end date. If not specified, the subscription will end based on the plan duration period.
* pricing\_components (array[PricingComponent], required) - One or more pricing components associated with the order item.
* metadata (OrderItemMetadata, optional) - Any key/value strings given for this item in the order creation request.
* product\_keys (array[ProductKey], optional) - Product keys associated with the order item.

### OrderItemCreateRequest (object)

#### Properties

* sku: ZZ456A (string, optional) - The order item SKU.
* product\_id: `bf8f7c15-0c3b-4dc5-b5b3-1595ba9b589e` (string, optional) - The Store product id associated with the order item.
* rate\_plan\_id: `85717ec8-6fcf-4fd9-9dbf-051af0ce1eb3` (string, optional) - The Store rate plan id associated with the order item.
* subscription\_start\_date: `2016-06-02T05:10:54Z` (string, optional) - An ISO-8601 timestamp representing the subscription start date. If not specified, the subscription will start at order fulfillment time.
* subscription\_end\_date: `2019-06-02T05:10:54Z` (string, optional) - An ISO-8601 timestamp representing the subscription end date. If not specified, the subscription will end based on the plan duration period.
* pricing\_components (array[PricingComponent], required) - One or more pricing components associated with the order item.
* metadata (OrderItemMetadata, optional) - Mapping of key/value strings for this order item.
* product\_keys (array[ProductKeyCreateRequest], optional) - Product keys associated with the order item.

### PricingComponent (object)

#### Properties

* name: `Nodes` (string, required) - The pricing component slug. For example Nodes or Engines.
* value: 25 (number, required) - The quantity for the given pricing component. For example 1 support, 15 docker engines, or 5 private repos.

### ProductKeyCreateRequest (object)

#### Properties

* label: `Production` (string, required) - The human-readable label for the given product key that will be displayed to the customer.
* media\_type: `text/plain` (enum, required) - An accepted IANA Media Type for this product key. This suggests to the user interface how to display the product key for the customer to use.
  * text/plain
  * application/json
* file\_name: `production-key.txt` (string, optional) - The file name for the downloaded file if the product key is a blob that requires or allows download by the customer.
* value: `AbKe13894Aksel` (string, required) - The contents of the product key as a string. If the value is blob that cannot be represented as a string, the contents will be encoded as a Base64 string.

### ProductKey (object)

#### Properties

* id: `390745e6-faba-11e6-bc64-92361f002671` (string, required) - The product key id.
* order\_item\_id: `85717ec8-6fcf-4fd9-9dbf-051af0ce1eb3` (string, required) - The id of the order item that this product key is associated with.
* label: `Production` (string, required) - The human-readable label for the given product key that will be displayed to the customer.
* media\_type: `text/plain` (enum, required) - An accepted IANA Media Type for this product key. This suggests to the user interface how to display the product key for the customer to use.
  * text/plain
  * application/json
* file\_name: `production-key.txt` (string, optional) - The file name for the downloaded file if the product key is a blob that requires or allows download by the customer.
* value: `AbKe13894Aksel` (string, required) - The contents of the product key as a string. If the value is blob that cannot be represented as a string, the contents will be encoded as a Base64 string.
* created: `2016-06-02T05:10:54Z` (string, required) - An ISO-8601 product key creation timestamp.
* updated: `2016-06-02T05:10:54Z` (string, required) - An ISO-8601 product key updated timestamp.

### OrderFulfillmentRequest (object)

#### Properties

* state: `fulfilled` (string, required) - The desired order state. Only a fulfilled state may be specified.
* docker\_id: `a76808b87b6c11e68b7786f30ca893d3` (string, required) - The docker id (user or org id) to fulfill the order for.
* eusa\_accepted: true (boolean, required) - Whether or not the EUSA associated with the order has been accepted

### OrderCancellationRequest (object)

#### Properties

* state: `cancelled` (string, required) - The desired order state. Only a cancelled state may be specified.

#### Requests

#### Create order [POST]

Create an order.

* Request (application/json)

  * Attributes (OrderCreateRequest)

#### List orders by token [GET /orders{?token}]

Retrieve an order with the given token. An empty array will be returned if no orders for the given token are found.

* Parameters

  * token: `DOCKER-TOKEN-2324234` (string, required) - The order token.
* Request (application/json)

#### List orders by partner [GET /orders{?partner\_id}]

List orders associated with the the given partner. An empty array will be returned if there are no orders associated with the partner.

* Parameters

  * partner\_id: partner-2342423 (string, required) - The partner identifier.
* Response 200 (application/json)

  * Attributes (array[Order])

### Order [/orders/{order\_id}]

* Parameters
  * order\_id: `ord-93b2dba2-79e3-11e6-8b77-86f30ca893d3` (string, required) - The order id.

#### Get order [GET]

Retrieve an order by id.

* Request (application/json)
* Response 200 (application/json)

  * Attributes (Order)

#### Update order [PATCH]

A number of operations can be performed by `PATCH`ing an order:

**Fulfill** an order. Fulfilling an order will put it in a fulfilled state, and will kick off a process to create subscriptions for each order item associated with the order.

* Request (application/json)

  * Attributes (OrderFulfillmentRequest)
* Response 200

  * Attributes (Order)

**Cancel** an order. Canceling an order will put it in a cancelled state. The order is frozen once cancelled (that is, no further changes may be made to it).

* Request (application/json)
  * Attributes (OrderCancellationRequest)
* Response 200

  * Attributes (Order)

### Order item product keys [/order-items/{order\_item\_id}/product-keys]

* Parameters
  * order\_item\_id: `ord-93b2dba2-79e3-11e6-8b77-86f30ca893d3` (string, required) - The order item id.

#### List product keys for order item [GET]

Retrieve all product keys for an order item by id. An empty array will be returned if the order item does not have any product keys.

* Request (application/json)
* Response 200 (application/json)

  * Attributes (array[ProductKey])

#### Create product key for order item [POST]

Create a product key for an existing order item. Note that adding new product keys will not affect existing product keys.

* Request (application/json)

  * Attributes (ProductKeyCreateRequest)
* Response 201 (application/json)

  * Attributes (ProductKey)

## Group product keys

A product key is a resource attached to an order item that a publisher manages on behalf of their customer. When an order is fulfilled and subscriptions are created for a customer, the product keys associated with that order item can be accessed by the customer.

### Product key [/product-keys/{product\_key\_id}]

* Parameters
  * product\_key\_id: `23443-93b2dba2-79e3-11e6-8b77-86f30ca893d3` (string, required) - The product key id.

#### Get product key [GET]

Retrieve a product key by id.

* Request (application/json)
* Response 200 (application/json)

  * Attributes (ProductKey)

#### Update product key [PUT]

Update a product key by id. All fields shown are required.

* Request (application/json)

  * Attributes (ProductKeyCreateRequest)
* Response 200 (application/json)

  * Attributes (ProductKey)

#### Delete product key [DELETE]

Delete a product key by id.

* Request (application/json)
* Response 204 (application/json)

## What's next?

More information about the publishing flow can be found [here](publish.md).