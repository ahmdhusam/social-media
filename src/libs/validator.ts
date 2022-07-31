import * as Yup from 'yup';
import { Gender } from '../models';

export const UserDataValidate = Yup.object().shape({
  password: Yup.string().required().trim().min(8).max(150),
  gender: Yup.string().required().trim().lowercase().oneOf([Gender.Male, Gender.Female]),
  birthDate: Yup.date().required(),
  email: Yup.string().required().trim().min(3).max(49).lowercase().email(),
  userName: Yup.string().required().trim().min(3).max(39).lowercase(),
  name: Yup.string().required().trim().min(3).max(99)
});

export const LoginDataValidate = Yup.object().shape({
  password: Yup.string().required().trim().min(8).max(150),
  email: Yup.string().required().trim().min(3).max(49).lowercase().email()
});

export const TweetDataValidate = Yup.object().shape({
  content: Yup.string().required().trim().min(1).max(140)
});

export const ReplyDataValidate = Yup.object().shape({
  content: Yup.string().required().trim().min(1).max(140),
  tweetId: Yup.string().required().trim().length(36)
});

export const PasswordsDataValidate = Yup.object().shape({
  newPassword: Yup.string().required().trim().min(8).max(150),
  oldPassword: Yup.string().required().trim().min(8).max(150)
});
