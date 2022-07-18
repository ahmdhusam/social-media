import * as Yup from 'yup';

export const UserValidate = Yup.object().shape({
    password: Yup.string().required().min(8).max(200).trim(),
    email: Yup.string().required().min(5).max(200).trim().email().lowercase(),
    userName: Yup.string().required().min(4).max(50).trim().lowercase(),
    lastName: Yup.string().required().min(5).max(200).trim(),
    firstName: Yup.string().required().min(5).max(200).trim()
});

export const TweetValidate = Yup.object().shape({
    content: Yup.string().required().min(1).max(150).trim()
});

export const ReplyValidate = Yup.object().shape({
    content: Yup.string().required().min(1).max(150).trim(),
    tweetId: Yup.string().required().length(24).trim()
});

export const changePasswordValidate = Yup.object().shape({
    newPassword: Yup.string().required().min(8).max(200).trim(),
    oldPassword: Yup.string().required().min(8).max(200).trim()
});

export const loginContentValidate = Yup.object().shape({
    password: Yup.string().required().min(8).max(200).trim(),
    email: Yup.string().required().min(5).max(200).trim().email().lowercase()
});
