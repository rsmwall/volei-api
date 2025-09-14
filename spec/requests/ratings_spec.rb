require 'swagger_helper'

RSpec.describe 'Ratings API', type: :request do
  path '/ratings' do
    post 'Creates a rating' do
      tags 'Ratings'
      consumes 'application/json'
      produces 'application/json'
      parameter name: :rating, in: :body, schema: {
        type: :object,
        properties: {
          rater_id: { type: :integer, example: 1, description: 'ID do jogador que está avaliando' },
          rated_id: { type: :integer, example: 2, description: 'ID do jogador que está sendo avaliado' },
          match_id: { type: :integer, example: 1, description: 'ID da partida' },
          score: { type: :integer, example: 5, description: 'Pontuação da avaliação (1-5)' }
        },
        required: %w[rater_id rated_id match_id score]
      }
      response '201', 'rating created' do
        let(:organizer) { Player.create(name: 'Organizador', email: 'organizador@example.com', gender: 'male', category: 'profissional') }
        let(:rated_player) { Player.create(name: 'Jogador Avaliado', email: 'avaliado@example.com', gender: 'female', category: 'amador') }
        let(:match) { Match.create(title: 'Partida Teste', location: 'Local', date: '2025-09-20T14:00:00Z', category: 'mista', status: 'completed', organizer_id: organizer.id) }
        let(:rating) { { rater_id: organizer.id, rated_id: rated_player.id, match_id: match.id, score: 5 } }
        run_test!
      end
    end
  end
end
