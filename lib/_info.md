# Architecture

## Dependencies
*-> means 'depends on'*

use, define, core-private -> util \
use, define -> core-private \
use -> define

## Meaning
### core-private
- no direct usage by users
- all basic entity types

### define
- using the lib means defining specs and keys first

### use
- how can the definitions above be used?

# Namespaces & keys
All are strings (namespace, key, nskey, partkey)

## Namespace
*'domain', 'error', 'domain/biography', ...*\
Hierarchies are possible

## Key

### Partial Key (partkey)
*'name', 'age', 'height', ...*\
NO specifications for these

### Namespaced Key (nskey)
*'domain/name', 'domain/age', ...*\
**$def** defines specs for these

# Further Terminology

## object.withXyz(val)

This creates a clone 
- with a modified 'xyz' field 
- set to value 'val'