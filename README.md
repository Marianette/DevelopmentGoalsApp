# Gender Equality Visualisation Tool

##### Hosted at: http://gender-equality-vis.herokuapp.com/

This is a web application that showcases datasets related to gender equality in the following areas:
  - Education
  - Employment
  - Political Participation

The datasets related to gender equality in these areas are showcased in different types of visualisations, created using the
D3 Javascript library.

## How to run the application locally

#### System Properties and Dependencies

- Rails Version: `4.2.6`
- Ruby Version: `2.2.4`
- Database: Postgres

**Note: Application has been tested on Google Chrome 52+. (Older versions of the browser may have issues with some styling features)**

#### Running this Application

- Install the dependencies listed above

- Clone this repo and navigate to its directory

- Run `bundle install`. This will install the required gems and dependencies

- Run the following commands in order to setup the database, and precompile the assets.
    - `rake db:create`
    - `bundle exec rake assets:precompile db:migrate`


- Run `rake db:seed`. This will populate the database with the data used by the visualisations. The data files can be found in the _db/data_ folder

- Run `rails server` to launch the server

- Navigate to `localhost:3000/`. You should now have the Gender Equality Visualisation Tool running
