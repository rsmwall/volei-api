class PlayersController < ApplicationController
  def create
    @player = Player.new(player_params)
    if @player.save
      render json: @player, status: :created
    else
      render json: @player.errors, status: :unprocessable_content
    end
  end

  def show
    @player = Player.find(params[:id])
    render json: @player, status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Jogador não encontrado" }, status: :not_found
  end

  def update
    if @player.update(player_params)
      render json: @player, status: :ok
    else
      render json: @player.errors, status: :unprocessable_content
    end
  end

  def ranking
    @players = Player.ranking
    render json: @players, status: :ok
  end

  private

  def set_player
    @player = Player.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Jogador não encontrado" }, status: :not_found
  end

  def player_params
    params.require(:player).permit(:name, :email, :gender, :category)
  end
end
