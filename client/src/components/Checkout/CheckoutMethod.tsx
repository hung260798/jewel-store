import { ASSET_URL } from "@/constants/URLS";
import { appendDomain } from "@/utils/stringUtils";
import { PaymentMethod } from "@/utils/types/entityTypes";
import { Button, Card, Col, Row, Space, Statistic } from "antd";
import Image from "next/image";
import { useState } from "react";

interface Props {
  dataMethod: PaymentMethod[];
}

const FALLBACK_PAYMENT_IMAGE = "/payment-method-fallback.svg";

const PaymentMethodImage = ({
  src,
  alt,
  width,
  height,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
}) => {
  const [imgSrc, setImgSrc] = useState(src || FALLBACK_PAYMENT_IMAGE);

  return (
    <Image
      className="ml-1"
      alt={alt}
      src={imgSrc}
      width={width}
      height={height}
      onError={() => {
        setImgSrc(FALLBACK_PAYMENT_IMAGE);
      }}
    />
  );
};

const CheckoutMethod = ({ dataMethod }: Props) => {
  return (
    <div className="container mx-auto">
      <Row
        className="py-3"
        gutter={[3, 10]}
      >
        {dataMethod?.map((item, index) => (
          <Col
            // style={{ width: "90%" }}
            key={`${item._id}-${index + 1}`}
            xs={24}
            xl={8}
          >
            <Card className="border mx-4">
              <div className="flex justify-between">
                <div className="content">
                  <Space>
                    <Statistic
                      title={item.title}
                      value={item.summary}
                    />
                  </Space>
                </div>
                <Button
                  icon={
                    <PaymentMethodImage
                      alt={item.title}
                      src={appendDomain(item.imageUrl, ASSET_URL)}
                      width={50}
                      height={50}
                    />
                  }
                  style={{
                    height: 60,
                    width: 60,
                  }}
                />
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CheckoutMethod;
