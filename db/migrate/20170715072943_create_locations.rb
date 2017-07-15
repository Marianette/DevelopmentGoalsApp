class CreateLocations < ActiveRecord::Migration
  def change
    create_table :locations do |t|
      t.string :country
      t.string :region
      t.integer :population, array: true
    end
  end
end
