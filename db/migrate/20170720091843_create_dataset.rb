class CreateDataset < ActiveRecord::Migration
  def change
    create_table :datasets do |t|
      t.string :data_type
      t.integer :location_id
      t.float :values, array: true
    end
  end
end
