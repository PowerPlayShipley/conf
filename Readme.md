# Conf Service

[![Node.js CI](https://github.com/PowerPlayShipley/conf/actions/workflows/node.js.yml/badge.svg)](https://github.com/PowerPlayShipley/conf/actions/workflows/node.js.yml)

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

See `/spec/oas.yaml`
