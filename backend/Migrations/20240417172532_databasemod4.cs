using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DigitalGamesMarketplace2.Migrations
{
    /// <inheritdoc />
    public partial class databasemod4 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "Latitude",
                table: "Developers",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "Longitude",
                table: "Developers",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Latitude",
                table: "Developers");

            migrationBuilder.DropColumn(
                name: "Longitude",
                table: "Developers");
        }
    }
}
