class AddFemalePopulationAndMalePopulationToLocations < ActiveRecord::Migration
  def change
    add_column :locations, :female_population, :integer, array: true
    add_column :locations, :male_population, :integer, array: true
  end
end
