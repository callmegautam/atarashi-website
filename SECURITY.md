# Security Policy

This policy covers the website and the blueprint registry it serves. For
vulnerabilities in the CLI itself, report them against
[callmegautam/atarashi](https://github.com/callmegautam/atarashi/security/advisories/new).

## Reporting a vulnerability

Please **do not** open a public issue. Report privately through
[GitHub Security Advisories](https://github.com/callmegautam/atarashi-website/security/advisories/new),
or email iamgautamsuthar@gmail.com.

Include the URL, reproduction steps, and the impact you observed. Expect an
acknowledgement within 72 hours and an assessment within 7 days.

## What matters most here

This origin serves `/registry`, which every published copy of the atarashi CLI
resolves blueprints against. That makes it a supply chain surface, so the
following are treated as high severity:

- Anything that serves modified blueprint tarballs or a modified index
- Anything that lets a response be cached under the wrong key or content type
- Anything that redirects registry traffic off this origin

The CLI verifies an integrity hash for every archive it downloads, so a tampered
tarball fails closed on the client. Report it anyway; failing closed is a
backstop, not the fix.

## Out of scope

- Missing security headers with no demonstrated impact
- Automated scanner output with no working reproduction
- Denial of service through volumetric traffic
- Issues in the documentation content itself, which belongs upstream in the CLI
  repo
