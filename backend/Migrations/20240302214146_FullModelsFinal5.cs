using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace DigitalGamesMarketplace2.Migrations
{
    /// <inheritdoc />
    public partial class FullModelsFinal5 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_GameWishlists",
                table: "GameWishlists");

            migrationBuilder.AlterColumn<int>(
                name: "GameWishlistId",
                table: "GameWishlists",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddPrimaryKey(
                name: "PK_GameWishlists",
                table: "GameWishlists",
                column: "GameWishlistId");

            migrationBuilder.CreateIndex(
                name: "IX_GameWishlists_WishlistId",
                table: "GameWishlists",
                column: "WishlistId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_GameWishlists",
                table: "GameWishlists");

            migrationBuilder.DropIndex(
                name: "IX_GameWishlists_WishlistId",
                table: "GameWishlists");

            migrationBuilder.AlterColumn<int>(
                name: "GameWishlistId",
                table: "GameWishlists",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddPrimaryKey(
                name: "PK_GameWishlists",
                table: "GameWishlists",
                columns: new[] { "WishlistId", "GameId" });
        }
    }
}
