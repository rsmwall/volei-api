class MatchRequestsController < ApplicationController
  before_action :set_match_request, only: [ :accept, :reject, :pay, :withdraw ]

  def create
    @match_request = MatchRequest.new(match_request_params)
    @match_request.status = "pending"
    if @match_request.save
      render json: @match_request, status: :created
    else
      render json: @match_request.errors, status: :unprocessable_content
    end
  end

  def accept
    if @match_request.update(status: "accepted")
      render json: @match_request, status: :ok
    else
      render json: @match_request.errors, status: :unprocessable_content
    end
  end

  def reject
    if @match_request.update(status: "rejected")
      render json: @match_request, status: :ok
    else
      render json: @match_request.errors, status: :unprocessable_content
    end
  end

  def pay
    if @match_request.update(status: "paid")
      render json: @match_request, status: :ok
    else
      render json: @match_request.errors, status: :unprocessable_content
    end
  end

  def withdraw
    if @match_request.update(status: "withdrawn")
      render json: @match_request, status: :ok
    else
      render json: @match_request.errors, status: :unprocessable_content
    end
  end

  private

  def set_match_request
    @match_request = MatchRequest.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Pedido de adesão não encontrado" }, status: :not_found
  end

  def match_request_params
    params.require(:match_request).permit(:player_id, :match_id)
  end
end
