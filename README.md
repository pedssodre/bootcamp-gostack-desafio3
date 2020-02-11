<p align="center">
  <img alt="FastFeet-Logo" src="https://user-images.githubusercontent.com/49238044/73901634-2a37e800-4872-11ea-9c65-c6c5ddcf4eda.png"        width="450px" />
  <h4 align="center"> RESTful API of the GoStack Final Project.</h3>
</p>

---

<p align="center">
  <a href="#page_with_curl-description">Description</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#information_source-how-to-use">How To Use</a>&nbsp;&nbsp;&nbsp;
</p>

## :page_with_curl: Description

This API was developed to be used in a web / mobile application for the final project of the GoStack taught by Rocketseat. The objective was to put into practice the concepts of RESTful API using a relational database (SQL) and a Key Value Store (Redis).

We used Sequelize to connect to PostgreSQL and we also used Redis to optimize the mails sent through queues. We also apply the MVC architecture type and JWT authentications together with Middlewares.

#### :rocket: Technologies

- Docker
- PostgreSQL
- NodeJS
- ExpressJS
- Sequelize
- Multer
- JWT
- Yup
- Nodemailer
- Handlebars
- ESLint
- Prettier
- EditorConfig

## :information_source: How To Use

```bash
# Clone this repository
$ git clone https://github.com/redpeds/bootcamp-gostack-desafio3.git

# Go into the repository
$ cd bootcamp-gostack-desafio3

# Install dependencies
$ yarn

# Run the app
$ yarn dev

# Run the queues with redis
$ yarn queue
```

#### Note: You must have installed the [Yarn](https://yarnpkg.com/) package manager globally. In addition, a PostgreSQL and Redis database. To test sending emails use the [Mailtrap](https://mailtrap.io/). Finally, set the environment variables using the ".env.example" file as a base.
