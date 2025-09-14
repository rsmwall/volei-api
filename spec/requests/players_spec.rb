require 'swagger_helper'

RSpec.describe 'Players API', type: :request do
    path '/players' do
        post 'Create a player' do
            tags 'Players'
            consumes 'application/json'
            produces 'application/json'
            parameter name: :player, in: :body, schema: {
                type: :object,
                properties: {
                    player: {
                        type: :object,
                        properties: {
                            name: { type: :string },
                            email: { type: :string },
                            gender: { type: :string },
                            category: { type: :string }
                        },
                        required: [ 'name', 'email', 'gender', 'category' ]
                    }
                },
                required: [ 'player' ]
            }

            response '201', 'player created' do
                let(:player) { { name: 'João', email: 'joao@example.com', gender: 'male', category: 'amador' } }
                run_test!
            end

            response '422', 'invalid request' do
                let(:player) { { name: 'João' } }
                run_test!
            end
        end
    end

    path '/players/{id}' do
        get 'Retrieves a player' do
            tags 'Players'
            produces 'application/json'
            parameter name: :id, in: :path, type: :string, description: 'ID do jogador'

            response '200', 'player found' do
                let(:id) { Player.create(name: 'João', email: 'joao@example.com', gender: 'male', category: 'amador').id }
                run_test!
            end

            response '404', 'player not found' do
                let(:id) { 'invalid' }
                run_test!
            end
        end

        patch 'Updates a player' do
            tags 'Players'
            consumes 'application/json'
            produces 'application/json'
            parameter name: :id, in: :path, type: :string, description: 'ID do jogador'
            parameter name: :player, in: :body, schema: {
                type: :object,
                properties: {
                category: { type: :string, example: 'profissional' }
                },
                required: %w[category]
            }

            response '200', 'player updated' do
                let(:id) { Player.create(name: 'João', email: 'joao@example.com', gender: 'male', category: 'amador').id }
                let(:player) { { category: 'profissional' } }
                run_test!
            end

            response '404', 'player not found' do
                let(:id) { 'invalid' }
                let(:player) { { category: 'profissional' } }
                run_test!
            end
        end
    end

    path '/players/ranking' do
        get 'Retrieves player rankings' do
            tags 'Players'
            produces 'application/json'

            response '200', 'ranking retrieved' do
                let!(:player1) { Player.create(name: 'Jogador A', email: 'a@ex.com', gender: 'male', category: 'amador') }
                let!(:player2) { Player.create(name: 'Jogador B', email: 'b@ex.com', gender: 'female', category: 'iniciante') }
                let!(:organizer) { Player.create(name: 'Organizador', email: 'c@ex.com', gender: 'male', category: 'profissional') }
                let!(:match) { Match.create(title: 'Partida Teste', location: 'Local', date: '2025-09-20T14:00:00Z', category: 'mista', status: 'completed', organizer_id: organizer.id) }
                let!(:rating1) { Rating.create(rater_id: organizer.id, rated_id: player1.id, match_id: match.id, score: 5) }
                let!(:rating2) { Rating.create(rater_id: organizer.id, rated_id: player2.id, match_id: match.id, score: 3) }

                run_test! do |response|
                data = JSON.parse(response.body)
                expect(data.first['name']).to eq('Jogador A')
                end
            end
        end
    end
end
