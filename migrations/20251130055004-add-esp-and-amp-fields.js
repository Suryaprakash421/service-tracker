module.exports = {
  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async up(db, client) {
    await db.collection('jobs').updateMany(
      { estimatedPrice: { $exists: false } },
      { $set: { estimatedPrice: 0, paidAmount: 0 } }
    );
  },

  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async down(db, client) {
    await db.collection('jobs').updateMany({}, {
      $unset: { estimatedPrice: "", paidAmount: "" }
    });
  }
};
