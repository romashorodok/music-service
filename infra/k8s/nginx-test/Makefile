.PHONY: template
template:
	helm template nginx ingress-nginx/ingress-nginx --namespace ingress --values values.yaml --output-dir nginx

.PHONY: install
install:
	helm install nginx ingress-nginx/ingress-nginx --namespace ingress --values values.yaml --create-namespace

.PHONY: repo
repo:
	helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx

.PHONY: uninstall
uninstall:
	helm uninstall nginx -n ingress
