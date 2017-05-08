# ISO Data Service (isodata) API documentation version 1.0.0

---

## Languages
Work with `Language` objects for all languages in the system. All `name` properties get automatically translated by the service depending on a request's `accept-language` header.

### /languages

#### **GET**:
List of `Language` objects index by the id of a language.

###### Headers

| Name | Type | Description | Required | Examples |
|:-----|:----:|:------------|:--------:|---------:|
| Accept-Language | string | Header containing a sorted list of accepted languages. | false | ``` de, en-gb;q=0.8, en;q=0.7 ```  |

### Response code: 200

#### LanguageMap (application/json) 

```
{
  "de": {
    "id": "de",
    "name": "German"
  },
  "en": {
    "id": "en",
    "name": "English"
  }
}
 ```

##### *LanguageMap*:
| Name | Type | Description | Required | Pattern |
|:-----|:----:|:------------|:--------:|--------:|
| // | object |  | true |  |

| Name | Type | Description | Required | Pattern |
|:-----|:----:|:------------|:--------:|--------:|
| id | string |  | true | \w{2,3} |
| name | string |  | true |  |

---

### /languages/{id}

* **id**: Identifier of a currency.
    * Type: string
    * Pattern: \w{2,3}
    * Required: true

#### **GET**:
Single `Language` object.

###### Headers

| Name | Type | Description | Required | Examples |
|:-----|:----:|:------------|:--------:|---------:|
| Accept-Language | string | Header containing a sorted list of accepted languages. | false | ``` de, en-gb;q=0.8, en;q=0.7 ```  |

### Response code: 200

#### Language (application/json) 

```
{
  "id": "en",
  "name": "English"
}
 ```

##### *Language*:
| Name | Type | Description | Required | Pattern |
|:-----|:----:|:------------|:--------:|--------:|
| id | string |  | true | \w{2,3} |
| name | string |  | true |  |

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

