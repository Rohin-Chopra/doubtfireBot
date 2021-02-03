exports.addAssociations = (sequelize) => {
  const { Student, Unit, Task } = sequelize.models;

  Task.hasMany(Student);
  Student.belongsTo(Task);

  Student.belongsToMany(Task, { through: "Enrollment" });
  Unit.belongsToMany(Student, { through: "Enrollment" });

  Task.belongsTo(Unit);
  Unit.hasMany(Task);
};
