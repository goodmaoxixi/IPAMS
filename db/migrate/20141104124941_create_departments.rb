class CreateDepartments < ActiveRecord::Migration
  def change
    create_table :departments do |t|
      t.string :dept_name, unique: true
      t.string :location

      t.timestamps
    end
  end
end
