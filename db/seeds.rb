# This file contains code that will be run when 'rake db:seed' is called.
# It populates the database.

%w(location
   female_population
   male_population
   gender_inequality_index
   labour_force_female
   labour_force_male
   national_income_female
   national_income_male
   secondary_education_female
   secondary_education_male
   parliament).each do |type|
  file_name = 'db/data/' + type + '.json'
  hashes = JSON.parse(File.read(file_name))
  PopulateDatabase.new(hashes, type).call
end
