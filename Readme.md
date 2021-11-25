# Conf Service

The configuration service, this holds the fine configuration, storing them in a datastore, with a redis
cache in front of to speed up response time.

## Architecture

```shell
|     LB     |
      |
      v
   | conf | --> | redis |
      |
      v
 | Storage |
```

## Endpoints

### /conf/:id

```json
{
  "meta": {
    "status": 200,
    "requestId": "qwertyuiop"
  },
  "data": {
    "players": {},
    "fines": {},
    "meta": {}
  }
}
```
