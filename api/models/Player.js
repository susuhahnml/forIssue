/**
 * Player.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name: {
      type: 'string',
      unique:true
    },

    cards: {
      collection: 'Card',
      via: 'player'
    },

    printWithCards: function(){
      var currentPlayer= this;
      Player.findOne(currentPlayer.id)
      .populate("cards")
      .exec(function(errDB,playerFound){
        console.log(playerFound);
      });
    }
  },

  newRelationship: function(cb){
    Player.create({name: "player1"}, function(errDB, player1){
      Card.create({key: "key1", player: player1}, function(errDB, card1){
        player1.printWithCards();//Player 1 with card1

        //Changing card to new player
        Player.create({name: "player2"}, function(errDB, player2){
          card1.player = player2;
          card1.save(function(errDB){
            //Changes made correctly, old relationship removed/overwritten
            player1.printWithCards();//Has no cards
            player2.printWithCards();//Has card 1

            //Removing old relationship wich does not exist
            player1.cards.remove(card1.id);
            //Saving after remove
            player1.save(function(errDB){
              player1.printWithCards(); //Player 1 has no card. Correct!
              player2.printWithCards(); //Player2 now has no cards. Wrong!!!
            });

          });
        });
      });
    });
  }
};
