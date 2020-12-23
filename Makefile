.PHONY: start build install clean

start: install
	bundle exec jekyll serve --config _config.yml,_config-dev.yml

build: install
	bundle exec jekyll build --config _config.yml,_config-dev.yml

install: Gemfile

Gemfile:
	bundle install

clean:
	bundle exec jekyll clean
