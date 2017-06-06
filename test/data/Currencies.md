# ISO Data Service (isodata) API documentation version 1.0.0

---

## Currencies
Work with `Currency` objects for all currencies in the system. All `name` properties get automatically translated by the service depending on a request's `accept-language` header.

### /currencies

#### **GET**:
List of `Currency` objects index by the id of a currency.

###### Headers

| Name | Type | Description | Required | Examples |
|:-----|:----:|:------------|:--------:|---------:|
| Accept-Language | string | Header containing a sorted list of accepted languages. | false | ``` de, en-gb;q=0.8, en;q=0.7 ```  |

### Response code: 200

#### CurrencyMap (application/json) 

```
{
  "EUR": {
      "id": "EUR",
      "name": "Euro",
      "number": 978,
      "exponent": 2,
      "symbol": "€"
  },
  "USD": {
      "id": "USD",
      "name": "US Dollar",
      "number": 840,
      "exponent": 2,
      "symbol": "$"
  }
}
```

##### *CurrencyMap*:
| Name | Type | Description | Required | Pattern |
|:-----|:----:|:------------|:--------:|--------:|
| // | object | Object representing a single currency item. | true |  |

| Name | Type | Description | Required | Pattern |
|:-----|:----:|:------------|:--------:|--------:|
| id | string | Three character identifier of a currency. | true | \w{3} |
| name | string | Translated name of a currency. | true |  |
| number | integer | Unique numeric representation of a currency. | true |  |
| exponent | integer | Number of digits after a decimal point. | true |  |
| symbol | string | UTF-8 symbol of a currency. | true |  |

---

### /currencies/{id}

* **id**: Identifier of a currency.
    * Type: string
    * Pattern: \w{3}
    * Required: true

#### **GET**:
Single `Currency` object.

###### Headers

| Name | Type | Description | Required | Examples |
|:-----|:----:|:------------|:--------:|---------:|
| Accept-Language | string | Header containing a sorted list of accepted languages. | false | ``` de, en-gb;q=0.8, en;q=0.7 ```  |

### Response code: 200

#### Currency (application/json) 
Object representing a single currency item.

```
{
    "id": "EUR",
    "name": "Euro",
    "number": 978,
    "exponent": 2,
    "symbol": "€"
}
```

##### *Currency*:
| Name | Type | Description | Required | Pattern |
|:-----|:----:|:------------|:--------:|--------:|
| id | string | Three character identifier of a currency. | true | \w{3} |
| name | string | Translated name of a currency. | true |  |
| number | integer | Unique numeric representation of a currency. | true |  |
| exponent | integer | Number of digits after a decimal point. | true |  |
| symbol | string | UTF-8 symbol of a currency. | true |  |

### Response code: 404
Sent if no object for the passed `id` was found.

#### Error (application/json) 

```
{
    "message": "Not found!"
}
```

##### *Error*:
| Name | Type | Description | Required | Pattern |
|:-----|:----:|:------------|:--------:|--------:|
| message | string |  | true |  |

---

