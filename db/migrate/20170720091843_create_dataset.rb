class CreateDataset < ActiveRecord::Migration
  def change
    create_table :dataset do |t|
      t.string :type
      t.integer :location_id
      t.float :values, array: true
    end
  end
end
