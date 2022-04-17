# Instructions for creating CSR request for multiple domains:

1. Use createcsr.conf includedd

2. Execute:
   openssl req -new -config createcsr.conf -keyout mysite.key -out mysite.csr
   openssl x509 -req -days 365 -in mysite.csr -signkey mysite.key -sha256 -out mysite.crt -extensions req_ext -extfile createcsr.conf

# Troubleshooting:

## Validate CSR

openssl req -noout -text -in mysite.csr | grep -A 1 "Subject Alternative Name"

## Validate Cert

openssl x509 -text -noout -in mysite.crt | grep -A 1 "Subject Alternative Name"
