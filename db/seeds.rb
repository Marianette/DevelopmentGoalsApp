# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).

%w(location).each do |type|
  file_name = 'db/data/' + type + '.json'
  hashes = JSON.parse(File.read(file_name))
  PopulateDatabase.new(hashes, type).call
end
