#### To install it execute this command:

	sudo curl -L "https://github.com/docker/compose/releases/download/1.26.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
	
Configure permissions

	sudo chmod +x /usr/local/bin/docker-compose

Check the path

	sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

Check the installation

	docker-compose --version
	>> docker-compose version 1.26.0, build d4451659

Check this link [Install Docker Compose](https://docs.docker.com/compose/install/ ) 

Once the docker-compse is installed, you can execute the yml-file.

	docker-compose up

The process starts:

	>> docker-compose up
	Creating network "database_postgres_net" with driver "bridge"
	Creating volume "database_postgres_vol" with default driver
	Creating volume "database_pgadmin_vol" with default driver
	Pulling postgres (postgres:)...
	latest: Pulling from library/postgres
	6ec8c9369e08: Pull complete
	00ae2204e425: Pull complete
	5cd41d2c6d66: Pull complete
	da0d72207e49: Pull complete
	842ab77320bc: Pull complete

	...
	
	7231831aa37f: Pull complete
	fb080a4d48f1: Pull complete
	4d7383b60165: Pull complete
	4a77fea73307: Pull complete
	6009276092a9: Pull complete
	Digest: sha256:6a250876f8dec6fcf1f3ce255da7c02cb74c48bab023e073fd4f3125d496a275
	Status: Downloaded newer image for postgres:latest
	Pulling pgadmin (dpage/pgadmin4:)...
	latest: Pulling from dpage/pgadmin4
	cbdbe7a5bc2a: Pull complete
	26ebcd19a4e3: Pull complete
	a29d43ca1bb4: Pull complete

	...
	
	4518c6b2e553: Pull complete
	de136ea9fe52: Pull complete
	018ace2369af: Pull complete
	ebc726df28b6: Pull complete
	Digest: sha256:e653453cbeeba098bae4de9c7c3388278d4b695814f2f6d25ceed2a02ce7887c
	Status: Downloaded newer image for dpage/pgadmin4:latest
	Creating pgadmin_container  ... done
	Creating postgres_container ... done
	Attaching to pgadmin_container, postgres_container
	postgres_container | The files belonging to this database system will be owned by user "postgres".
	postgres_container | This user must also own the server process.
	postgres_container | 
	postgres_container | The database cluster will be initialized with locale "en_US.utf8".
	postgres_container | The default database encoding has accordingly been set to "UTF8".
	postgres_container | The default text search configuration will be set to "english".
	postgres_container | 
	postgres_container | Data page checksums are disabled.
	postgres_container | 
	postgres_container | fixing permissions on existing directory /data/postgres ... ok
	postgres_container | creating subdirectories ... ok
	postgres_container | selecting dynamic shared memory implementation ... posix
	postgres_container | selecting default max_connections ... 100
	postgres_container | selecting default shared_buffers ... 128MB
	postgres_container | selecting default time zone ... Etc/UTC
	postgres_container | creating configuration files ... ok
	postgres_container | running bootstrap script ... ok
	postgres_container | performing post-bootstrap initialization ... ok
	postgres_container | syncing data to disk ... ok
	postgres_container | 
	postgres_container | 
	postgres_container | Success. You can now start the database server using:
	postgres_container | 
	postgres_container |     pg_ctl -D /data/postgres -l logfile start
	postgres_container | 
	postgres_container | initdb: warning: enabling "trust" authentication for local connections
	postgres_container | You can change this by editing pg_hba.conf or using the option -A, or
	postgres_container | --auth-local and --auth-host, the next time you run initdb.
	postgres_container | waiting for server to start....2020-07-23 10:28:34.043 UTC [47] LOG:  starting PostgreSQL 12.3 (Debian 12.3-1.pgdg100+1) on x86_64-pc-linux-gnu, compiled by gcc (Debian 8.3.0-6) 8.3.0, 64-bit
	postgres_container | 2020-07-23 10:28:34.068 UTC [47] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
	postgres_container | 2020-07-23 10:28:34.209 UTC [48] LOG:  database system was shut down at 2020-07-23 10:28:28 UTC
	postgres_container | 2020-07-23 10:28:34.236 UTC [47] LOG:  database system is ready to accept connections
	postgres_container |  done
	postgres_container | server started
	postgres_container | CREATE DATABASE
	postgres_container | 
	postgres_container | 
	postgres_container | /usr/local/bin/docker-entrypoint.sh: ignoring /docker-entrypoint-initdb.d/*
	postgres_container | 
	postgres_container | 2020-07-23 10:28:35.336 UTC [47] LOG:  received fast shutdown request
	postgres_container | waiting for server to shut down....2020-07-23 10:28:35.359 UTC [47] LOG:  aborting any active transactions
	postgres_container | 2020-07-23 10:28:35.360 UTC [47] LOG:  background worker "logical replication launcher" (PID 54) exited with exit code 1
	postgres_container | 2020-07-23 10:28:35.360 UTC [49] LOG:  shutting down
	postgres_container | 2020-07-23 10:28:35.523 UTC [47] LOG:  database system is shut down
	postgres_container |  done
	postgres_container | server stopped
	postgres_container | 
	postgres_container | PostgreSQL init process complete; ready for start up.
	postgres_container | 
	postgres_container | 2020-07-23 10:28:35.570 UTC [1] LOG:  starting PostgreSQL 12.3 (Debian 12.3-1.pgdg100+1) on x86_64-pc-linux-gnu, compiled by gcc (Debian 8.3.0-6) 8.3.0, 64-bit
	postgres_container | 2020-07-23 10:28:35.571 UTC [1] LOG:  listening on IPv4 address "0.0.0.0", port 5432
	postgres_container | 2020-07-23 10:28:35.571 UTC [1] LOG:  listening on IPv6 address "::", port 5432
	postgres_container | 2020-07-23 10:28:35.621 UTC [1] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
	postgres_container | 2020-07-23 10:28:35.705 UTC [65] LOG:  database system was shut down at 2020-07-23 10:28:35 UTC
	postgres_container | 2020-07-23 10:28:35.730 UTC [1] LOG:  database system is ready to accept connections
	pgadmin_container | NOTE: Configuring authentication for SERVER mode.
	pgadmin_container | 
	pgadmin_container | sudo: setrlimit(RLIMIT_CORE): Operation not permitted
	pgadmin_container | [2020-07-23 10:28:39 +0000] [1] [INFO] Starting gunicorn 19.9.0
	pgadmin_container | [2020-07-23 10:28:39 +0000] [1] [INFO] Listening at: http://[::]:80 (1)
	pgadmin_container | [2020-07-23 10:28:39 +0000] [1] [INFO] Using worker: threads
	pgadmin_container | /usr/local/lib/python3.8/os.py:1023: RuntimeWarning: line buffering (buffering=1) isn't supported in binary mode, the default buffer size will be used
	pgadmin_container |   return io.open(fd, *args, **kwargs)
	pgadmin_container | [2020-07-23 10:28:39 +0000] [89] [INFO] Booting worker with pid: 89

The next time you start the docker-compose, it would be faster since the docker images would be already installed.