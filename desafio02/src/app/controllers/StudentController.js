import * as Yup from 'yup';
import Student from '../models/Student';
import User from '../models/User';

class StudentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.date().required(),
      weight: Yup.number().required(),
      height: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const checkIsAdmin = await User.findOne({
      where: { id: req.userId, user_admin: true },
    });

    if (!checkIsAdmin) {
      return res
        .status(401)
        .json({ error: 'You can only enroll students with admin users' });
    }

    const studentExist = await Student.findOne({
      where: { email: req.body.email },
    });
    if (studentExist) {
      return res.status(400).json({ error: 'Student already exists.' });
    }

    const { name, email, age, weight, height } = req.body;

    const student = await Student.create({
      user_id: req.userId,
      name,
      email,
      age,
      weight,
      height,
    });

    return res.json(student);
  }
}

export default new StudentController();
