import * as mongoose from 'mongoose';

const mongodbUrl: string = 'mongodb://127.0.0.1:27017/letgoshop';

export const createMongoConnection = (
  options: mongoose.ConnectionOpenOptions
) => {
  mongoose.connect(
    mongodbUrl,
    options
  );
};
