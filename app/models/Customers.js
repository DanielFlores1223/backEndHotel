const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const CustomersSchema = mongoose.Schema(
     {
          idUser: {
               type: ObjectId,
               required: true   
          },
          address: {
               street: String,
               colony: String,
               externalNumber: String,
               internalNumber: String
          },
          city: String,
          country: String,
          reservations: [
               {
                    idRooms: {
                         type: Array,
                         required: true
                    },
                    startDate: {
                         type: Date,
                         required: true
                    },
                    finishDate: {
                         type: Date,
                         required: true
                    },
                    reservationDate: {
                         type: Date,
                         required: true
                    },
                    methodPayment: {
                         type: String,
                         enum: {
                              values: ['Card', 'Cash'],
                              message: '{VALUE} only has two values "Card" or "Cash"'
                         },
                         required: true
                    },
                    creditCard: {
                         reference: String,
                         typeCreditCard: {
                              type: String,
                              enum: {
                                   values: ['Visa', 'American Express'],
                                   message: '{VALUE} only has two values "Visa" or "American Express"'
                              }
                         }
                    },
                    extraExpenses: [
                         {
                              creditCard: {
                                   reference: String,
                                   typeCreditCard: {
                                        type: String,
                                        enum: {
                                             values: ['Visa', 'American Express'],
                                             message: '{VALUE} only has two values "Visa" or "American Express"'
                                        }
                                   }
                              },
                              dateTime: Date,
                              idAdditionalService: ObjectId,
                              signatureCostumer: Boolean,
                              paid: Boolean,
                              methodPayment: {
                                   type: String,
                                   enum: {
                                        values: ['Card', 'Cash', 'Open Bill'],
                                        message: '{VALUE} only has three values "Card", "Cash", "Open Bill"'
                                   }
                              }
                         }
                    ],
                    paid: {
                         type: Boolean,
                         required: true
                    },
                    openBill: {
                         type: Boolean,
                         required: true
                    },
                    fullPayment: {
                         type: Number,
                         required: true
                    },
                    changeRoom: [
                         {
                              idNewRoom: ObjectId,
                              reasonChange: String
                         }
                    ],
                    survey: {
                         answer1: String,
                         answer2: String,
                         answer3: String,
                         answer4: String,
                         answer5: String,
                         answer6: String,
                         answer7: String,
                         answered: Boolean
                    }
               }
          ]
     }
);

module.exports = mongoose.model('Customers', CustomersSchema);