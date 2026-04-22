import { Link } from "react-router-dom";
import CountdownTimer from "./CountdownTimer";

const FALLBACK =
  "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80";

const fmt = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const isExpired = (endDate) => endDate && new Date(endDate) < Date.now();
const isActive  = (start, end) =>
  (!start || new Date(start) <= Date.now()) &&
  (!end   || new Date(end)   >= Date.now());

const OfferCard = ({ offer, index = 0 }) => {
  const expired = isExpired(offer.endDate);
  const active  = isActive(offer.startDate, offer.endDate);

  const ctaLink = offer.ctaLink
    || (offer.relatedCollection ? `/collections/${offer.relatedCollection}` : null)
    || (offer.relatedProduct    ? `/shop/${offer.relatedProduct}` : null)
    || "/contact";

  return (
    <article
      className="offer-card"
      style={{
        opacity: 0,
        animation: `ofFadeUp 0.55s ${index * 0.08}s forwards`,
      }}
    >
      {/* Image */}
      <div className="offer-card__img-wrap">
        <img
          className="offer-card__img"
          src={offer.thumbnail || offer.bannerImage || FALLBACK}
          alt={offer.title}
          loading="lazy"
          onError={(e) => (e.currentTarget.src = FALLBACK)}
        />
        {offer.discountText && (
          <span className={`offer-card__badge${expired ? " offer-card__badge--expired" : ""}`}>
            {offer.discountText}
          </span>
        )}
        {expired && (
          <div className="offer-card__expired-overlay">Offer Expired</div>
        )}
      </div>

      {/* Body */}
      <div className="offer-card__body">
        {offer.type && (
          <span className="offer-card__type">{offer.type}</span>
        )}

        <h3 className="offer-card__title">{offer.title}</h3>

        {offer.description && (
          <p className="offer-card__desc">{offer.description}</p>
        )}

        <div className="offer-card__validity">
          <div>
            {/* Show countdown if still active */}
            {active && !expired && offer.endDate ? (
              <CountdownTimer endDate={offer.endDate} />
            ) : (
              <span className="offer-card__dates">
                {offer.startDate && `From ${fmt(offer.startDate)}`}
                {offer.startDate && offer.endDate && " — "}
                {offer.endDate && `Until ${fmt(offer.endDate)}`}
              </span>
            )}
          </div>

          {!expired && (
            <Link to={ctaLink} className="offer-card__cta">
              {offer.ctaLabel || "View Offer"}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
};

export default OfferCard;