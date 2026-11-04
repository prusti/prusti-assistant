# Change Log

All notable changes to the "prusti-assistant" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [Unreleased]

- Initial release

## [0.12.8]

- Download Prusti from its new repository, [prusti/prusti](https://github.com/prusti/prusti).
- The default `Latest` Prusti version now always downloads `v-2024-02-28-1817`, the newest Prusti release with assets compatible with this version of the extension. Existing installations are replaced on the next start.
- Stop prompting to update Prusti every 30 days, since the default version is fixed.
