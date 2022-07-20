import * as Yup from 'yup';

export const UserValidate = Yup.object().shape({
  password: Yup.string().required().trim().min(8).max(200),
  email: Yup.string().required().trim().min(5).max(200).lowercase().email(),
  userName: Yup.string().required().trim().min(4).max(50).lowercase(),
  lastName: Yup.string().required().trim().min(3).max(200),
  firstName: Yup.string().required().trim().min(3).max(200)
});

export const TweetValidate = Yup.object().shape({
  content: Yup.string().required().trim().min(1).max(150)
});

export const ReplyValidate = Yup.object().shape({
  content: Yup.string().required().trim().min(1).max(150),
  tweetId: Yup.string().required().trim().length(24)
});

export const changePasswordValidate = Yup.object().shape({
  newPassword: Yup.string().required().trim().min(8).max(200),
  oldPassword: Yup.string().required().trim().min(8).max(200)
});

export const loginContentValidate = Yup.object().shape({
  password: Yup.string().required().trim().min(8).max(200),
  email: Yup.string().required().trim().min(5).max(200).lowercase().email()
});
