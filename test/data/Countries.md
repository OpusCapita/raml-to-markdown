# ISO Data Service (isodata) API documentation version 1.0.0

---

## Countries
Work with `Country` objects for all countries in the system. All `name` properties get automatically translated by the service depending on a request's `accept-language` header.

### /countries

#### **GET**:
List of `Country` objects index by the id of a country.

###### Headers

| Name | Type | Description | Required | Examples |
|:-----|:----:|:------------|:--------:|---------:|
| Accept-Language | string | Header containing a sorted list of accepted languages. | false | ``` de, en-gb;q=0.8, en;q=0.7 ```  |

### Response code: 200

#### CountryMap (application/json) 

```
{
  "DE": {
      "id": "DE",
      "alpha3Code": "DEU",
      "number": 276,
      "name": "Euro",
      "countryCode": "49"
  },
  "US": {
      "id": "US",
      "alpha3Code": "USA",
      "number": 840,
      "name": "United States of America",
      "countryCode": "1"
  }
}
```

##### *CountryMap*:
| Name | Type | Description | Required | Pattern |
|:-----|:----:|:------------|:--------:|--------:|
| // | object | Object representing a single country item. | true |  |

| Name | Type | Description | Required | Pattern |
|:-----|:----:|:------------|:--------:|--------:|
| id | string | Two character country codes. | true | \w{2} |
| alpha3Code | string | Alpha-3-Code | true | \w{3} |
| number | integer | Number | true |  |
| name | string | Translated name of a country. | true |  |
| countryCode | string | Internation phone dial country code. | true |  |

---

### /countries/{id}

* **id**: Identifier of a country.
    * Type: string
    * Pattern: \w{3}
    * Required: true

#### **GET**:
Single `Country` object.

###### Headers

| Name | Type | Description | Required | Examples |
|:-----|:----:|:------------|:--------:|---------:|
| Accept-Language | string | Header containing a sorted list of accepted languages. | false | ``` de, en-gb;q=0.8, en;q=0.7 ```  |

### Response code: 200

#### Country (application/json) 
Object representing a single country item.

```
{
    "id": "DE",
    "alpha3Code": "DEU",
    "number": 276,
    "name": "Euro",
    "countryCode": "49"
}
```

##### *Country*:
| Name | Type | Description | Required | Pattern |
|:-----|:----:|:------------|:--------:|--------:|
| id | string | Two character country codes. | true | \w{2} |
| alpha3Code | string | Alpha-3-Code | true | \w{3} |
| number | integer | Number | true |  |
| name | string | Translated name of a country. | true |  |
| countryCode | string | Internation phone dial country code. | true |  |

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

