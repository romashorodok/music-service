#!/bin/bash

function build () {
    local image=$1
    local dockerfile=$2
    local context=$3

    docker build -f $dockerfile -t $image $context
}

build music-service-backend ./Dockerfile . &
build music-service-packages ./packages.Dockerfile . &

wait

k3d image import  music-service-backend music-service-packages --cluster music-service-cluster
