# Hello hello
.phony: all
all: install
	sudo node bin/tarine.js /home/mick/www/logopedia

.phony: install 
install:
	sudo npm install . -g

