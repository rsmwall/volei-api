require 'swagger_helper'

RSpec.describe 'MatchRequests API', type: :request do
  path '/match_requests' do
    post 'Creates a match request' do
      tags 'MatchRequests'
      consumes 'application/json'
      produces 'application/json'
      parameter name: :match_request, in: :body, schema: {
        type: :object,
        properties: {
          player_id: { type: :integer, example: 1 },
          match_id: { type: :integer, example: 1 }
        },
        required: %w[player_id match_id]
      }
      response '201', 'match request created' do
        let(:player) { Player.create(name: 'Jogador Teste', email: 'teste@example.com', gender: 'male', category: 'amador') }
        let(:match) { Match.create(title: 'Partida Teste', location: 'Local', date: '2025-09-20T14:00:00Z', category: 'mista', status: 'new', organizer_id: 1) }
        let(:match_request) { { player_id: player.id, match_id: match.id } }
        run_test!
      end
    end
  end

  path '/match_requests/{id}/accept' do
    patch 'Accepts a match request' do
      tags 'MatchRequests'
      produces 'application/json'
      parameter name: :id, in: :path, type: :integer, description: 'ID do pedido de adesão'

      response '200', 'request accepted' do
        let(:player) { Player.create(name: 'Jogador Teste', email: 'teste@example.com', gender: 'male', category: 'amador') }
        let(:match) { Match.create(title: 'Partida Teste', location: 'Local', date: '2025-09-20T14:00:00Z', category: 'mista', status: 'new', organizer_id: 1) }
        let(:id) { MatchRequest.create(player_id: player.id, match_id: match.id, status: 'pending').id }
        run_test!
      end
    end
  end

  path '/match_requests/{id}/reject' do
    patch 'Rejects a match request' do
      tags 'MatchRequests'
      produces 'application/json'
      parameter name: :id, in: :path, type: :integer, description: 'ID do pedido de adesão'

      response '200', 'request rejected' do
        let(:player) { Player.create(name: 'Jogador Teste', email: 'teste@example.com', gender: 'male', category: 'amador') }
        let(:match) { Match.create(title: 'Partida Teste', location: 'Local', date: '2025-09-20T14:00:00Z', category: 'mista', status: 'new', organizer_id: 1) }
        let(:id) { MatchRequest.create(player_id: player.id, match_id: match.id, status: 'pending').id }
        run_test!
      end
    end
  end

  path '/match_requests/{id}/pay' do
    patch 'Marks a match request as paid' do
      tags 'MatchRequests'
      produces 'application/json'
      parameter name: :id, in: :path, type: :integer, description: 'ID do pedido de adesão'

      response '200', 'request paid' do
        let(:player) { Player.create(name: 'Jogador Teste', email: 'teste@example.com', gender: 'male', category: 'amador') }
        let(:match) { Match.create(title: 'Partida Teste', location: 'Local', date: '2025-09-20T14:00:00Z', category: 'mista', status: 'new', organizer_id: 1) }
        let(:id) { MatchRequest.create(player_id: player.id, match_id: match.id, status: 'pending').id }
        run_test!
      end
    end
  end

  path '/match_requests/{id}/withdraw' do
    patch 'Withdraws a match request' do
      tags 'MatchRequests'
      produces 'application/json'
      parameter name: :id, in: :path, type: :integer, description: 'ID do pedido de adesão'

      response '200', 'request withdrawn' do
        let(:player) { Player.create(name: 'Jogador Teste', email: 'teste@example.com', gender: 'male', category: 'amador') }
        let(:match) { Match.create(title: 'Partida Teste', location: 'Local', date: '2025-09-20T14:00:00Z', category: 'mista', status: 'new', organizer_id: 1) }
        let(:id) { MatchRequest.create(player_id: player.id, match_id: match.id, status: 'pending').id }
        run_test!
      end
    end
  end
end