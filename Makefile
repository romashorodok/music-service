
all:
	kubectl apply --recursive -f ./infra/k8s

cluster:
	k3d cluster create music-service-cluster \
        --agents 1 -p 8080:80@agent:0 -p 31820:31820/UDP@agent:0 \
        --registry-create k3d-music-service-registry

delete:
	k3d cluster delete music-service-cluster

registry:
	docker run -d \
		--restart=always \
		--name registry \
		-v "$(PWD)/infra/certs:/certs" \
		-e REGISTRY_HTTP_ADDR=0.0.0.0:443 \
		-e REGISTRY_HTTP_TLS_CERTIFICATE=/certs/domain.crt \
		-e REGISTRY_HTTP_TLS_KEY=/certs/domain.key \
		-p 443:443 \
		registry:2


certs:
	openssl req \
		-newkey rsa:4096 -nodes -sha256 -keyout ./infra/certs/registry.key \
		-config openssl-san.cnf \
		-x509 -days 365 -out ./infra/certs/registry.crt

.PHONY: all registry certs
