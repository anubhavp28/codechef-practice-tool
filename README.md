# CodeChef Practice Tool

[CodeChef](https://codechef.com/) is among the most popular competitive programming platforms despite that the platform lacks advanced search functionalities like searching problems using a set of tags, authors, contests.

This tool offers the advanced search functionalities lacking in the CodeChef platform. The data is scraped using CodeChef API (this API is not publically available though CodeChef does grant access to users who participate in certain hackathons). Unfortunately, this means that the database would not update automatically.

PS : Let me know if any one of you manages to hack an unofficial API on top of CodeChef.

## Deployed at https://quiet-savannah-14489.herokuapp.com/

## Tech Stack

The backend is written in [PHP](https://www.php.net/) using the [Slim Framework](https://www.slimframework.com/). [MariaDB](https://mariadb.org/) is used to store the data. The frontend is implemented in [React](https://reactjs.org/) with a lot of help from other libraries. The service is hosted on [Microsoft Azure](https://azure.microsoft.com/en-in/).

## TODO

1. User authentication.
2. Custom tags per user.
3. Could anyone of you help me setup SSL on my Azure VM?

