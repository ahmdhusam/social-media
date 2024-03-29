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
  new: Yup.string().required().trim().min(8).max(150),
  old: Yup.string().required().trim().min(8).max(150)
});

export const TimelineOptionsValidate = Yup.object().shape({
  limit: Yup.number().optional().positive().integer(),
  skip: Yup.number().optional().positive().integer()
});

export const EditUserDataValidate = Yup.object().shape({
  gender: Yup.string().optional().trim().lowercase().oneOf([Gender.Male, Gender.Female]),
  birthDate: Yup.date().optional(),
  email: Yup.string().optional().trim().min(3).max(49).lowercase().email(),
  userName: Yup.string().optional().trim().min(3).max(39).lowercase(),
  name: Yup.string().optional().trim().min(3).max(99)
});
