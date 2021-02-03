exports.addAssociations = (sequelize) => {
  const { student, unit, task } = sequelize.models;

  task.hasMany(student);
  student.belongsTo(task);

  student.belongsToMany(task, { through: "Enrollment" });
  unit.belongsToMany(student, { through: "Enrollment" });

  task.belongsTo(unit);
  unit.hasMany(task);
};
