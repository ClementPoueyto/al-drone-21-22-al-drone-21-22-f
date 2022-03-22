set DOCKER_HOST=tcp://0.0.0.0:2375
pumba --log-level=info --interval=25s --random kill "re2:^*kafka-broker*"