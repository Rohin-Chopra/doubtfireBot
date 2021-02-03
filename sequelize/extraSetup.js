exports.addAssociations = (sequelize) => {
  const { Student, Unit, Task } = sequelize.models;

  Student.hasMany(Task);
  Task.belongsTo(Student);

  Student.belongsToMany(Task, { through: "Enrollment" });
  Unit.belongsToMany(Student, { through: "Enrollment" });

  Unit.hasMany(Task);
  Task.belongsTo(Unit);
};
