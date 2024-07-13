## Todo:

- [ ] Create a database name based on project name and checking if it already exists
- [ ] Add Tray menu with (New Preset, Preset 1, Preset 2, Preset 3..., About, Exit)
- [ ] After create the project, open with default code editor

## Name ideas:

- QuickLaravel
- InstaLaravel
- LaravelGenie
- LaravelCraft
- LaravelBlueprint
- LaravelFactory

## All options of laravel installer:

```bash
laravel new --help
Description:
  Create a new Laravel application

Usage:
  new [options] [--] <name>

Arguments:
  name

Options:
      --dev                        Installs the latest "development" release
      --git                        Initialize a Git repository
      --branch=BRANCH              The branch that should be created for a new repository [default: "main"]
      --github[=GITHUB]            Create a new repository on GitHub [default: false]
      --organization=ORGANIZATION  The GitHub organization to create the new repository for
      --database=DATABASE          The database driver your application will use
      --stack[=STACK]              The Breeze / Jetstream stack that should be installed
      --breeze                     Installs the Laravel Breeze scaffolding
      --jet                        Installs the Laravel Jetstream scaffolding
      --dark                       Indicate whether Breeze or Jetstream should be scaffolded with dark mode support
      --typescript                 Indicate whether Breeze should be scaffolded with TypeScript support
      --ssr                        Indicate whether Breeze or Jetstream should be scaffolded with Inertia SSR support
      --api                        Indicates whether Jetstream should be scaffolded with API support
      --teams                      Indicates whether Jetstream should be scaffolded with team support
      --verification               Indicates whether Jetstream should be scaffolded with email verification support
      --pest                       Installs the Pest testing framework
      --phpunit                    Installs the PHPUnit testing framework
      --prompt-breeze              Issues a prompt to determine if Breeze should be installed (Deprecated)
      --prompt-jetstream           Issues a prompt to determine if Jetstream should be installed (Deprecated)
  -f, --force                      Forces install even if the directory already exists
  -h, --help                       Display help for the given command. When no command is given display help for the list command
  -q, --quiet                      Do not output any message
  -V, --version                    Display this application version
      --ansi|--no-ansi             Force (or disable --no-ansi) ANSI output
  -n, --no-interaction             Do not ask any interactive question
  -v|vv|vvv, --verbose             Increase the verbosity of messages: 1 for normal output, 2 for more verbose output and 3 for debug

 Which Breeze stack would you like to install? [Blade with Alpine]:
  - [blade              ] Blade with Alpine
  - [livewire           ] Livewire (Volt Class API) with Alpine
  - [livewire-functional] Livewire (Volt Functional API) with Alpine
  - [react              ] React with Inertia
  - [vue                ] Vue with Inertia
  - [api                ] API only

  Which database will your application use? [SQLite]:
  - [sqlite ] SQLite
  - [mysql  ] MySQL
  - [mariadb] MariaDB
  - [pgsql  ] PostgreSQL
  - [sqlsrv ] SQL Server (Missing PDO extension)

  Would you like any optional features? [None]:
  - [none        ] None
  - [api         ] API support
  - [dark        ] Dark mode
  - [verification] Email verification
  - [teams       ] Team support
  - [ssr         ] Inertia SSR
```
