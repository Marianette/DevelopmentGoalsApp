# encoding: UTF-8
# This file is auto-generated from the current state of the database. This
# schema.rb definition is the authoritative source for the database schema.
# If you need to create the application database on another system, use
# db:schema:load. Do not run all the migrations from scratch - this is an
# unsustainable approach (the more migrations - the slower it'll run) 

ActiveRecord::Schema.define(version: 20170720091843) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "datasets", force: :cascade do |t|
    t.string  "data_type"
    t.integer "location_id"
    t.float   "values",      array: true
  end

  create_table "locations", force: :cascade do |t|
    t.string  "country"
    t.string  "region"
    t.integer "population", array: true
  end

end
