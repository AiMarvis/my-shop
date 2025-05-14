-- 주문 테이블에 결제 정보 필드 추가
ALTER TABLE public.orders 
ADD COLUMN payment_id TEXT, -- 포트원 결제 고유 ID
ADD COLUMN payment_status TEXT, -- 결제 상태 (ready, paid, cancelled, failed)
ADD COLUMN payment_method_detail TEXT, -- 상세 결제 수단 정보
ADD COLUMN paid_at TIMESTAMP WITH TIME ZONE, -- 결제 완료 시간
ADD COLUMN receipt_url TEXT; -- 영수증 URL

-- payment_id에 인덱스 추가
CREATE INDEX IF NOT EXISTS orders_payment_id_idx ON public.orders(payment_id); 