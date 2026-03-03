// Firebase disabled for local development

const admin = {
  auth: () => ({
    verifyIdToken: async () => {
      throw new Error("Firebase disabled");
    },
  }),
};

export default admin;